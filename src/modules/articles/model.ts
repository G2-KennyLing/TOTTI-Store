import { ModificationNote } from "../common/model";

enum articlesStatus {
	PENDING, DRAFT, PUBLIC
}

export interface Iarticles {
	_id?: String,
	name: Number,
	description: String,
	summary: String,
	body: String,
	image: String,
	user_id: String,
	status?: articlesStatus
}