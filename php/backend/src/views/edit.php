<div class="wrapper">
    <div id="editor-container">
        <textarea id="editor" style="display: none">
            <?= htmlspecialchars($article['body']) ?>
        </textarea>
        <div id="sidebar"></div>
    </div>
</div>

<script src="/frontend/build/ckeditor.js"></script>
<script src="/frontend/src/userDataLoader.js"></script>
<script src="/frontend/src/customCommentsAdapter.js"></script>
<script src="/frontend/src/customTrackChangesAdapter.js"></script>
<script>
	const EXAMPLE = {
		ARTICLE_ID: <?=(int)$article['id']?>,
		CURRENT_USER_ID: <?=json_encode($currentUserId)?>,
		USERS: <?=json_encode($users)?>,
		CSRF_TOKEN: <?=json_encode($_SESSION['csrf_token'])?>
	};

	const { ClassicEditor: Editor, EditorWatchdog } = ClassicEditor;
	const watchdog = new EditorWatchdog();
	window.watchdog = watchdog;

	watchdog.setCreator( ( el, config ) => {
		return Editor.create( el, config )
			.then( editor => {
				// Switch between inline, narrow sidebar and wide sidebar according to the window size.
				const annotations = editor.plugins.get( 'Annotations' );
				const sidebarElement = document.querySelector( '#sidebar' );

				editor.ui.view.listenTo( window, 'resize', refreshDisplayMode );
				refreshDisplayMode();

				function refreshDisplayMode() {
					if ( window.innerWidth < 1000 ) {
						sidebarElement.classList.remove( 'narrow' );
						sidebarElement.classList.add( 'hidden' );
						annotations.switchTo( 'inline' );
					}
					else if ( window.innerWidth < 1300 ) {
						sidebarElement.classList.remove( 'hidden' );
						sidebarElement.classList.add( 'narrow' );
						annotations.switchTo( 'narrowSidebar' );
					}
					else {
						sidebarElement.classList.remove( 'hidden', 'narrow' );
						annotations.switchTo( 'wideSidebar' );
					}
				}

				return editor;
			} );
	} );

	watchdog.setDestructor( editor => editor.destroy() );

	watchdog.create(document.querySelector('#editor'), {
		extraPlugins: [ UserDataLoader, CustomCommentsAdapter, CustomTrackChangesAdapter ],
		licenseKey: <?=json_encode(LICENSE_KEY)?>,
		sidebar: {
			container: document.querySelector('#sidebar')
		},
		autosave: {
			save( editor ) {
				const formData = new FormData();
				formData.append( 'body', editor.getData() );
				formData.append( 'csrf_token', EXAMPLE.CSRF_TOKEN );

				return fetch( '/article/save/' + EXAMPLE.ARTICLE_ID, {
					method: "POST",
					body: formData
				} );
			}
		}
	} );
</script>
