import NodeCache from "node-cache";

export interface PlanningpokerSession {
	agenda: string;
	projectId: number;
	userstoryIds: number[];
	startedAt: Date;
}

const planningpokerSessions = new NodeCache({ stdTTL: 900, checkperiod: 300 });

function create(sessionCode: string, session: PlanningpokerSession) {
	planningpokerSessions.set(sessionCode, session);
}

function get(sessionCode: string): PlanningpokerSession | undefined {
	planningpokerSessions.ttl(sessionCode, 900);
	return planningpokerSessions.get(sessionCode);
}

function remove(sessionCode: string) {
	planningpokerSessions.del(sessionCode);
}

export const planningpoker = { create, get, remove };
