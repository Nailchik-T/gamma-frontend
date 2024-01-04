export interface IRecord {
	id: number;
	address: string | null;
	patientId: number;
	psychologistId: number;
	psychologistName: string;
	cityId: number;
	format: 'online' | 'offline';
	cost: number;
	duration?: number;
	broadcast: string;
	isCanceled: boolean;
	datetime: string;
	patientName: string;
}
