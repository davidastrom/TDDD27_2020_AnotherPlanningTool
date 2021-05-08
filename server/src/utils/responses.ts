import httpStatus from 'http-status-codes';

export function resSchema(data: any, status_code: number) {
	return {
		results: data,
		status: httpStatus.getStatusText(status_code),
	};
}

export function errSchema(data: any, status_code: number) {
	let res = {
		error: data,
		status: httpStatus.getStatusText(status_code),
	};

	if (typeof data === 'string') res.error = { message: data };

	return res;
}
