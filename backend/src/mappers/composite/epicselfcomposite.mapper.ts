import { EpicSelfComposite } from "forge-shared/dto/composite/epicselfcomposite.dto";

export function mapEpicSelfComposite(epic: any): EpicSelfComposite {
	return {
		id: epic.dataValues.id,
		title: epic.dataValues.name,
		description: epic.dataValues.description,
		createdAt: epic.dataValues.createdAt,
		updatedAt: epic.dataValues.updatedAt,
	};
}
