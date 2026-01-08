/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const usersMock = [
	{
		id: 'u1',
		name: 'Joe Doe',
		avatar: 'https://randomuser.me/api/portraits/thumb/men/26.jpg'
	},
	{
		id: 'u2',
		name: 'Ella Harper',
		avatar: 'https://randomuser.me/api/portraits/thumb/women/65.jpg'
	},
	{
		id: 'u3',
		name: 'John Christopher Smith',
		avatar: 'https://randomuser.me/api/portraits/thumb/men/55.jpg'
	}
];

const commentsMock = [
	{
		'threadId': 'e1c002a22e071af8e1ccac9a241dd968c',
		'context': {
			'type': 'text',
			'value': ''
		},
		'unlinkedAt': null,
		'resolvedAt': null,
		'resolvedBy': null,
		'archivedAt': null,
		'comments': [
			{
				'commentId': 'e8289da8d88e220c238cfb8d3aca1d6c7',
				'content': '<p>Can we replace with the latest logo here?</p>',
				'createdAt': '2024-07-11T09:25:58.387Z',
				'authorId': 'u1',
				'attributes': {}
			}
		],
		'attributes': {}
	},
	{
		'threadId': 'e448a90c49d0c6cf0192a60387ad73e75',
		'context': {
			'type': 'text',
			'value': 'The Lower Shelf'
		},
		'unlinkedAt': null,
		'resolvedAt': null,
		'resolvedBy': null,
		'archivedAt': null,
		'comments': [
			{
				'commentId': 'e2ef8288248aad76e56feffc7bd60d0f7',
				'content': '<p>Should be: The Lower Shelf Books.</p>',
				'createdAt': '2024-07-11T09:26:29.809Z',
				'authorId': 'u1',
				'attributes': {}
			}
		],
		'attributes': {}
	},
	{
		'threadId': 'e64b302905aa5c561d4a3ce1b650cf3c4',
		'context': {
			'type': 'text',
			'value': 'PUBLISHING AGREEMENT'
		},
		'unlinkedAt': null,
		'resolvedAt': null,
		'resolvedBy': null,
		'archivedAt': null,
		'comments': [
			{
				'commentId': 'e6ebeb6b681da6ace9048893039b16c62',
				'content': '<p>Let\'s add our logo above the title.</p>',
				'createdAt': '2024-07-11T13:42:12.565Z',
				'authorId': 'u1',
				'attributes': {}
			}
		],
		'attributes': {}
	},
	{
		'threadId': 'ebf6612d98099f856db7a37e2cd942e3f',
		'context': null,
		'unlinkedAt': null,
		'resolvedAt': null,
		'resolvedBy': null,
		'archivedAt': null,
		'comments': [],
		'attributes': {}
	},
	{
		'threadId': 'e9c83c841a9dfe3e589a498e01f9dbb8a',
		'context': null,
		'unlinkedAt': null,
		'resolvedAt': null,
		'resolvedBy': null,
		'archivedAt': null,
		'comments': [],
		'attributes': {}
	},
	{
		'threadId': 'e0bf15f6850548756a28fe8efe102adc9',
		'context': null,
		'unlinkedAt': null,
		'resolvedAt': null,
		'resolvedBy': null,
		'archivedAt': null,
		'comments': [],
		'attributes': {}
	},
	{
		'threadId': 'e92e1286e0a900952bf0ffce381a666f1',
		'context': null,
		'unlinkedAt': null,
		'resolvedAt': null,
		'resolvedBy': null,
		'archivedAt': null,
		'comments': [],
		'attributes': {}
	},
	{
		'threadId': 'ee854631407d6f79ba008efdf8ae43601',
		'context': null,
		'unlinkedAt': null,
		'resolvedAt': null,
		'resolvedBy': null,
		'archivedAt': null,
		'comments': [],
		'attributes': {}
	},
	{
		'threadId': 'e86d62daca94efed691464a323be95579',
		'context': null,
		'unlinkedAt': null,
		'resolvedAt': null,
		'resolvedBy': null,
		'archivedAt': null,
		'comments': [],
		'attributes': {}
	},
	{
		'threadId': 'eaffab6ec9e7c44fd3fee620e1b3dce7e',
		'context': null,
		'unlinkedAt': null,
		'resolvedAt': null,
		'resolvedBy': null,
		'archivedAt': null,
		'comments': [],
		'attributes': {}
	}
];

const suggestionsMock = [
	{
		'id': 'ebf6612d98099f856db7a37e2cd942e3f',
		'type': 'deletion',
		'authorId': 'u2',
		'createdAt': '2024-07-11T09:26:47.459Z',
		'hasComments': false,
		'data': null,
		'attributes': {}
	},
	{
		'id': 'e9c83c841a9dfe3e589a498e01f9dbb8a',
		'type': 'insertion',
		'authorId': 'u2',
		'createdAt': '2024-07-11T09:26:47.461Z',
		'hasComments': false,
		'data': null,
		'attributes': {}
	},
	{
		'id': 'e0bf15f6850548756a28fe8efe102adc9',
		'type': 'attribute:$elementName|4q8xstbcyvlu',
		'authorId': 'u2',
		'createdAt': '2024-07-11T09:26:57.817Z',
		'hasComments': false,
		'data': {
			'key': '$elementName',
			'oldValue': 'heading3',
			'newValue': 'heading2'
		},
		'attributes': {
			'groupId': 'e29913202479c3ad2560a04fb7fa4f816'
		}
	},
	{
		'id': 'e92e1286e0a900952bf0ffce381a666f1',
		'type': 'attribute:$elementName|4q8xstbcyvlu',
		'authorId': 'u2',
		'createdAt': '2024-07-11T09:27:01.015Z',
		'hasComments': false,
		'data': {
			'key': '$elementName',
			'oldValue': 'heading3',
			'newValue': 'heading2'
		},
		'attributes': {
			'groupId': 'e0a500b4fbd6a5841201d6b9ecc071439'
		}
	},
	{
		'id': 'ee854631407d6f79ba008efdf8ae43601',
		'type': 'deletion',
		'authorId': 'u2',
		'createdAt': '2024-07-11T09:27:18.363Z',
		'hasComments': false,
		'data': null,
		'attributes': {}
	},
	{
		'id': 'e86d62daca94efed691464a323be95579',
		'type': 'insertion',
		'authorId': 'u2',
		'createdAt': '2024-07-11T09:27:18.365Z',
		'hasComments': false,
		'data': null,
		'attributes': {}
	},
	{
		'id': 'eb75251e9a3dc6c332130ebca017b2e79',
		'type': 'insertion',
		'authorId': 'u3',
		'createdAt': '2024-07-11T11:49:32.010Z',
		'hasComments': false,
		'data': null,
		'attributes': {}
	}
];

const revisionsMock = [
	{
		'id': 'initial',
		'name': 'Initial revision',
		'creatorId': 'u1',
		'authorsIds': [ 'u1' ],
		'diffData': {
			'main': {
				'insertions': '[{"name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of ………… by and between The Lower Shelf, the “Publisher”, and …………, the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him/herself and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]},{"name":"p","attributes":[],"children":["Publishing formats are enumerated in Appendix A."]}]',
				'deletions': '[{"name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of ………… by and between The Lower Shelf, the “Publisher”, and …………, the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him/herself and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]},{"name":"p","attributes":[],"children":["Publishing formats are enumerated in Appendix A."]}]'
			}
		},
		'createdAt': '2024-05-27T13:22:59.077Z',
		'attributes': {},
		'fromVersion': 1,
		'toVersion': 1
	},
	{
		'id': 'e6f80e6be6ee6057fd5a449ab13fba25d',
		'name': 'Updated with the actual data',
		'creatorId': 'u1',
		'authorsIds': [ 'u1' ],
		'diffData': {
			'main': {
				'insertions': '[{"type":"c","name":"h1","attributes":[],"children":[{"type":"u","name":"comment-start","attributes":[["name","e64b302905aa5c561d4a3ce1b650cf3c4:eece1"]],"children":[]},"PUBLISHING AGREEMENT",{"type":"u","name":"comment-end","attributes":[["name","e64b302905aa5c561d4a3ce1b650cf3c4:eece1"]],"children":[]}]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of ",{"name":"revision-start","attributes":[["name","insertion:user-1:0"]],"children":[]},"1st",{"name":"revision-end","attributes":[["name","insertion:user-1:0"]],"children":[]}," ",{"name":"revision-start","attributes":[["name","insertion:user-1:1"]],"children":[]},"June 2020 ",{"name":"revision-end","attributes":[["name","insertion:user-1:1"]],"children":[]},"by and between The Lower Shelf, the “Publisher”, and ",{"name":"revision-start","attributes":[["name","insertion:user-1:2"]],"children":[]},"John Smith",{"name":"revision-end","attributes":[["name","insertion:user-1:2"]],"children":[]},", the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]}]',
				'deletions': '[{"type":"c","name":"h1","attributes":[],"children":[{"type":"u","name":"comment-start","attributes":[["name","e64b302905aa5c561d4a3ce1b650cf3c4:eece1"]],"children":[]},"PUBLISHING AGREEMENT",{"type":"u","name":"comment-end","attributes":[["name","e64b302905aa5c561d4a3ce1b650cf3c4:eece1"]],"children":[]}]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of ",{"name":"revision-start","attributes":[["name","deletion:user-1:0"]],"children":[]},"…………",{"name":"revision-end","attributes":[["name","deletion:user-1:0"]],"children":[]}," by and between The Lower Shelf, the “Publisher”, and ",{"name":"revision-start","attributes":[["name","deletion:user-1:1"]],"children":[]},"…………",{"name":"revision-end","attributes":[["name","deletion:user-1:1"]],"children":[]},", the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him",{"name":"revision-start","attributes":[["name","deletion:user-1:2"]],"children":[]},"/herself",{"name":"revision-end","attributes":[["name","deletion:user-1:2"]],"children":[]}," and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature.",{"name":"revision-start","attributes":[["name","deletion:user-1:3"]],"children":[]}]},{"name":"p","attributes":[],"children":["Publishing formats are enumerated in Appendix A.",{"name":"revision-end","attributes":[["name","deletion:user-1:3"]],"children":[]}]}]'
			}
		},
		'createdAt': '2024-05-27T13:23:52.553Z',
		'attributes': {},
		'fromVersion': 1,
		'toVersion': 20
	},
	{
		'id': 'e6590c50ccbc86acacb7d27231ad32064',
		'name': 'Inserted logo',
		'creatorId': 'u1',
		'authorsIds': [ 'u1' ],
		'diffData': {
			'main': {
				'insertions': '[{"name":"figure","attributes":[["data-revision-start-before","insertion:user-1:0"],["class","image"]],"children":[{"name":"img","attributes":[["src","https://ckeditor.com/docs/ckeditor5/latest/assets/img/revision-history-demo.png"]],"children":[]}]},{"name":"h1","attributes":[],"children":[{"name":"revision-end","attributes":[["name","insertion:user-1:0"]],"children":[]},"PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of 1st June 2020 by and between The Lower Shelf, the “Publisher”, and John Smith, the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]}]',
				'deletions': '[{"name":"h1","attributes":[["data-revision-start-before","deletion:user-1:0"]],"children":[{"name":"revision-end","attributes":[["name","deletion:user-1:0"]],"children":[]},"PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of 1st June 2020 by and between The Lower Shelf, the “Publisher”, and John Smith, the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]}]'
			}
		},
		'createdAt': '2024-05-27T13:26:39.252Z',
		'attributes': {},
		'fromVersion': 20,
		'toVersion': 24
	},
	{
		'id': 'current',
		'name': 'Current',
		'creatorId': 'u2',
		'authorsIds': [ 'u2', 'u3' ],
		'diffData': {
			'main': {
				'insertions': '[{"type":"c","name":"figure","attributes":[["data-comment-end-after","e1c002a22e071af8e1ccac9a241dd968c:a9d29"],["data-comment-start-before","e1c002a22e071af8e1ccac9a241dd968c:a9d29"],["class","image"]],"children":[{"type":"e","name":"img","attributes":[["src","https://ckeditor.com/docs/ckeditor5/latest/assets/img/revision-history-demo.png"]],"children":[]}]},{"type":"c","name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"type":"c","name":"h2","attributes":[["data-suggestion-start-before","attribute:$elementName|4q8xstbcyvlu:e0bf15f6850548756a28fe8efe102adc9:u2"]],"children":["Introduction ",{"type":"u","name":"suggestion-end","attributes":[["name","attribute:$elementName|4q8xstbcyvlu:e0bf15f6850548756a28fe8efe102adc9:u2"]],"children":[]}]},{"type":"c","name":"p","attributes":[],"children":["This publishing contract, the “ ",{"type":"u","name":"suggestion-start","attributes":[["name","insertion:e86d62daca94efed691464a323be95579:u2"]],"children":[]},"C",{"type":"u","name":"suggestion-start","attributes":[["name","deletion:ee854631407d6f79ba008efdf8ae43601:u2"]],"children":[]},{"type":"u","name":"suggestion-end","attributes":[["name","insertion:e86d62daca94efed691464a323be95579:u2"]],"children":[]},"c",{"type":"u","name":"suggestion-end","attributes":[["name","deletion:ee854631407d6f79ba008efdf8ae43601:u2"]],"children":[]},"ontract”, is entered into as of 1st June ",{"type":"u","name":"suggestion-start","attributes":[["name","insertion:e9c83c841a9dfe3e589a498e01f9dbb8a:u2"]],"children":[]},"2024 ",{"type":"u","name":"suggestion-start","attributes":[["name","deletion:ebf6612d98099f856db7a37e2cd942e3f:u2"]],"children":[]},{"type":"u","name":"suggestion-end","attributes":[["name","insertion:e9c83c841a9dfe3e589a498e01f9dbb8a:u2"]],"children":[]},"2020 ",{"type":"u","name":"suggestion-end","attributes":[["name","deletion:ebf6612d98099f856db7a37e2cd942e3f:u2"]],"children":[]},"by and between ",{"type":"u","name":"comment-start","attributes":[["name","e448a90c49d0c6cf0192a60387ad73e75:1596d"]],"children":[]},"The Lower Shelf ",{"type":"u","name":"comment-end","attributes":[["name","e448a90c49d0c6cf0192a60387ad73e75:1596d"]],"children":[]},", the “Publisher”, and John ",{"type":"u","name":"suggestion-start","attributes":[["name","insertion:eb75251e9a3dc6c332130ebca017b2e79:u3"]],"children":[]},"Christopher ",{"type":"u","name":"suggestion-end","attributes":[["name","insertion:eb75251e9a3dc6c332130ebca017b2e79:u3"]],"children":[]},"Smith, the “Author”."]},{"type":"c","name":"h2","attributes":[["data-suggestion-start-before","attribute:$elementName|4q8xstbcyvlu:e92e1286e0a900952bf0ffce381a666f1:u2"]],"children":["Grant of Rights ",{"type":"u","name":"suggestion-end","attributes":[["name","attribute:$elementName|4q8xstbcyvlu:e92e1286e0a900952bf0ffce381a666f1:u2"]],"children":[]}]},{"type":"c","name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"type":"a","name":"ul","attributes":[],"children":[{"type":"a","name":"li","attributes":[],"children":[{"type":"c","name":"p","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]}]},{"type":"a","name":"li","attributes":[],"children":[{"type":"c","name":"p","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]}]},{"type":"a","name":"li","attributes":[],"children":[{"type":"c","name":"p","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]}]},{"type":"c","name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"type":"c","name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"type":"c","name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]}]',
				'deletions': '[{"type":"c","name":"figure","attributes":[["data-comment-end-after","e1c002a22e071af8e1ccac9a241dd968c:a9d29"],["data-comment-start-before","e1c002a22e071af8e1ccac9a241dd968c:a9d29"],["class","image"]],"children":[{"type":"e","name":"img","attributes":[["src","https://ckeditor.com/docs/ckeditor5/latest/assets/img/revision-history-demo.png"]],"children":[]}]},{"type":"c","name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"type":"c","name":"h2","attributes":[["data-suggestion-start-before","attribute:$elementName|4q8xstbcyvlu:e0bf15f6850548756a28fe8efe102adc9:u2"]],"children":["Introduction ",{"type":"u","name":"suggestion-end","attributes":[["name","attribute:$elementName|4q8xstbcyvlu:e0bf15f6850548756a28fe8efe102adc9:u2"]],"children":[]}]},{"type":"c","name":"p","attributes":[],"children":["This publishing contract, the “ ",{"type":"u","name":"suggestion-start","attributes":[["name","insertion:e86d62daca94efed691464a323be95579:u2"]],"children":[]},"C",{"type":"u","name":"suggestion-start","attributes":[["name","deletion:ee854631407d6f79ba008efdf8ae43601:u2"]],"children":[]},{"type":"u","name":"suggestion-end","attributes":[["name","insertion:e86d62daca94efed691464a323be95579:u2"]],"children":[]},"c",{"type":"u","name":"suggestion-end","attributes":[["name","deletion:ee854631407d6f79ba008efdf8ae43601:u2"]],"children":[]},"ontract”, is entered into as of 1st June ",{"type":"u","name":"suggestion-start","attributes":[["name","insertion:e9c83c841a9dfe3e589a498e01f9dbb8a:u2"]],"children":[]},"2024 ",{"type":"u","name":"suggestion-start","attributes":[["name","deletion:ebf6612d98099f856db7a37e2cd942e3f:u2"]],"children":[]},{"type":"u","name":"suggestion-end","attributes":[["name","insertion:e9c83c841a9dfe3e589a498e01f9dbb8a:u2"]],"children":[]},"2020 ",{"type":"u","name":"suggestion-end","attributes":[["name","deletion:ebf6612d98099f856db7a37e2cd942e3f:u2"]],"children":[]},"by and between ",{"type":"u","name":"comment-start","attributes":[["name","e448a90c49d0c6cf0192a60387ad73e75:1596d"]],"children":[]},"The Lower Shelf ",{"type":"u","name":"comment-end","attributes":[["name","e448a90c49d0c6cf0192a60387ad73e75:1596d"]],"children":[]},", the “Publisher”, and John ",{"type":"u","name":"suggestion-start","attributes":[["name","insertion:eb75251e9a3dc6c332130ebca017b2e79:u3"]],"children":[]},"Christopher ",{"type":"u","name":"suggestion-end","attributes":[["name","insertion:eb75251e9a3dc6c332130ebca017b2e79:u3"]],"children":[]},"Smith, the “Author”."]},{"type":"c","name":"h2","attributes":[["data-suggestion-start-before","attribute:$elementName|4q8xstbcyvlu:e92e1286e0a900952bf0ffce381a666f1:u2"]],"children":["Grant of Rights ",{"type":"u","name":"suggestion-end","attributes":[["name","attribute:$elementName|4q8xstbcyvlu:e92e1286e0a900952bf0ffce381a666f1:u2"]],"children":[]}]},{"type":"c","name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"type":"a","name":"ul","attributes":[],"children":[{"type":"a","name":"li","attributes":[],"children":[{"type":"c","name":"p","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]}]},{"type":"a","name":"li","attributes":[],"children":[{"type":"c","name":"p","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]}]},{"type":"a","name":"li","attributes":[],"children":[{"type":"c","name":"p","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]}]},{"type":"c","name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"type":"c","name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"type":"c","name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]}]',
				'attachChange': null,
				'attributesBefore': {},
				'attributesAfter': {}
			}
		},
		'createdAt': '2024-07-11T12:11:54.493Z',
		'attributes': {},
		'fromVersion': 24,
		'toVersion': 42
	},
	// Empty current revision:
	{
		'id': 'egh91t5jccbi894cacxx7dz7t36aj3k021',
		'name': null,
		'creatorId': null,
		'authorsIds': [],
		'diffData': {
			'main': {
				'insertions': '[{"type":"c","name":"figure","attributes":[["data-comment-end-after","e1c002a22e071af8e1ccac9a241dd968c:a9d29"],["data-comment-start-before","e1c002a22e071af8e1ccac9a241dd968c:a9d29"],["class","image"]],"children":[{"type":"e","name":"img","attributes":[["src","https://ckeditor.com/docs/ckeditor5/latest/assets/img/revision-history-demo.png"]],"children":[]}]},{"type":"c","name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"type":"c","name":"h2","attributes":[["data-suggestion-start-before","attribute:$elementName|4q8xstbcyvlu:e0bf15f6850548756a28fe8efe102adc9:u2"]],"children":["Introduction ",{"type":"u","name":"suggestion-end","attributes":[["name","attribute:$elementName|4q8xstbcyvlu:e0bf15f6850548756a28fe8efe102adc9:u2"]],"children":[]}]},{"type":"c","name":"p","attributes":[],"children":["This publishing contract, the “ ",{"type":"u","name":"suggestion-start","attributes":[["name","insertion:e86d62daca94efed691464a323be95579:u2"]],"children":[]},"C",{"type":"u","name":"suggestion-start","attributes":[["name","deletion:ee854631407d6f79ba008efdf8ae43601:u2"]],"children":[]},{"type":"u","name":"suggestion-end","attributes":[["name","insertion:e86d62daca94efed691464a323be95579:u2"]],"children":[]},"c",{"type":"u","name":"suggestion-end","attributes":[["name","deletion:ee854631407d6f79ba008efdf8ae43601:u2"]],"children":[]},"ontract”, is entered into as of 1st June ",{"type":"u","name":"suggestion-start","attributes":[["name","insertion:e9c83c841a9dfe3e589a498e01f9dbb8a:u2"]],"children":[]},"2024 ",{"type":"u","name":"suggestion-start","attributes":[["name","deletion:ebf6612d98099f856db7a37e2cd942e3f:u2"]],"children":[]},{"type":"u","name":"suggestion-end","attributes":[["name","insertion:e9c83c841a9dfe3e589a498e01f9dbb8a:u2"]],"children":[]},"2020 ",{"type":"u","name":"suggestion-end","attributes":[["name","deletion:ebf6612d98099f856db7a37e2cd942e3f:u2"]],"children":[]},"by and between ",{"type":"u","name":"comment-start","attributes":[["name","e448a90c49d0c6cf0192a60387ad73e75:1596d"]],"children":[]},"The Lower Shelf ",{"type":"u","name":"comment-end","attributes":[["name","e448a90c49d0c6cf0192a60387ad73e75:1596d"]],"children":[]},", the “Publisher”, and John ",{"type":"u","name":"suggestion-start","attributes":[["name","insertion:eb75251e9a3dc6c332130ebca017b2e79:u3"]],"children":[]},"Christopher ",{"type":"u","name":"suggestion-end","attributes":[["name","insertion:eb75251e9a3dc6c332130ebca017b2e79:u3"]],"children":[]},"Smith, the “Author”."]},{"type":"c","name":"h2","attributes":[["data-suggestion-start-before","attribute:$elementName|4q8xstbcyvlu:e92e1286e0a900952bf0ffce381a666f1:u2"]],"children":["Grant of Rights ",{"type":"u","name":"suggestion-end","attributes":[["name","attribute:$elementName|4q8xstbcyvlu:e92e1286e0a900952bf0ffce381a666f1:u2"]],"children":[]}]},{"type":"c","name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"type":"a","name":"ul","attributes":[],"children":[{"type":"a","name":"li","attributes":[],"children":[{"type":"c","name":"p","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]}]},{"type":"a","name":"li","attributes":[],"children":[{"type":"c","name":"p","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]}]},{"type":"a","name":"li","attributes":[],"children":[{"type":"c","name":"p","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]}]},{"type":"c","name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"type":"c","name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"type":"c","name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]}]',
				'deletions': '[{"type":"c","name":"figure","attributes":[["data-comment-end-after","e1c002a22e071af8e1ccac9a241dd968c:a9d29"],["data-comment-start-before","e1c002a22e071af8e1ccac9a241dd968c:a9d29"],["class","image"]],"children":[{"type":"e","name":"img","attributes":[["src","https://ckeditor.com/docs/ckeditor5/latest/assets/img/revision-history-demo.png"]],"children":[]}]},{"type":"c","name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"type":"c","name":"h2","attributes":[["data-suggestion-start-before","attribute:$elementName|4q8xstbcyvlu:e0bf15f6850548756a28fe8efe102adc9:u2"]],"children":["Introduction ",{"type":"u","name":"suggestion-end","attributes":[["name","attribute:$elementName|4q8xstbcyvlu:e0bf15f6850548756a28fe8efe102adc9:u2"]],"children":[]}]},{"type":"c","name":"p","attributes":[],"children":["This publishing contract, the “ ",{"type":"u","name":"suggestion-start","attributes":[["name","insertion:e86d62daca94efed691464a323be95579:u2"]],"children":[]},"C",{"type":"u","name":"suggestion-start","attributes":[["name","deletion:ee854631407d6f79ba008efdf8ae43601:u2"]],"children":[]},{"type":"u","name":"suggestion-end","attributes":[["name","insertion:e86d62daca94efed691464a323be95579:u2"]],"children":[]},"c",{"type":"u","name":"suggestion-end","attributes":[["name","deletion:ee854631407d6f79ba008efdf8ae43601:u2"]],"children":[]},"ontract”, is entered into as of 1st June ",{"type":"u","name":"suggestion-start","attributes":[["name","insertion:e9c83c841a9dfe3e589a498e01f9dbb8a:u2"]],"children":[]},"2024 ",{"type":"u","name":"suggestion-start","attributes":[["name","deletion:ebf6612d98099f856db7a37e2cd942e3f:u2"]],"children":[]},{"type":"u","name":"suggestion-end","attributes":[["name","insertion:e9c83c841a9dfe3e589a498e01f9dbb8a:u2"]],"children":[]},"2020 ",{"type":"u","name":"suggestion-end","attributes":[["name","deletion:ebf6612d98099f856db7a37e2cd942e3f:u2"]],"children":[]},"by and between ",{"type":"u","name":"comment-start","attributes":[["name","e448a90c49d0c6cf0192a60387ad73e75:1596d"]],"children":[]},"The Lower Shelf ",{"type":"u","name":"comment-end","attributes":[["name","e448a90c49d0c6cf0192a60387ad73e75:1596d"]],"children":[]},", the “Publisher”, and John ",{"type":"u","name":"suggestion-start","attributes":[["name","insertion:eb75251e9a3dc6c332130ebca017b2e79:u3"]],"children":[]},"Christopher ",{"type":"u","name":"suggestion-end","attributes":[["name","insertion:eb75251e9a3dc6c332130ebca017b2e79:u3"]],"children":[]},"Smith, the “Author”."]},{"type":"c","name":"h2","attributes":[["data-suggestion-start-before","attribute:$elementName|4q8xstbcyvlu:e92e1286e0a900952bf0ffce381a666f1:u2"]],"children":["Grant of Rights ",{"type":"u","name":"suggestion-end","attributes":[["name","attribute:$elementName|4q8xstbcyvlu:e92e1286e0a900952bf0ffce381a666f1:u2"]],"children":[]}]},{"type":"c","name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"type":"a","name":"ul","attributes":[],"children":[{"type":"a","name":"li","attributes":[],"children":[{"type":"c","name":"p","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]}]},{"type":"a","name":"li","attributes":[],"children":[{"type":"c","name":"p","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]}]},{"type":"a","name":"li","attributes":[],"children":[{"type":"c","name":"p","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]}]},{"type":"c","name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"type":"c","name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"type":"c","name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]}]',
				'attachChange': null,
				'attributesBefore': {},
				'attributesAfter': {}
			}
		},
		'createdAt': '2024-07-11T12:11:54.493Z',
		'attributes': {},
		'fromVersion': 42,
		'toVersion': 42
	}
];

export {
	usersMock,
	commentsMock,
	suggestionsMock,
	revisionsMock
};
