import { ModificationNote } from "../common/model";

enum articlesStatus {
	PENDING, UNAPPROVE, APPROVE
}

export interface Iarticles {
	_id?: String,
	heading: String,
	content: String,
	image: String,
	author: String,
	status?: articlesStatus
}