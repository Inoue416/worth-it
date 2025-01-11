const invalidCharsPattern = /[<>{}[\]()'"`;]/;
const scriptTagPattern = /script/i;
const javascriptPattern = /javascript/i;
const onEventPattern = /\bon[a-z]+\s*=/i; // onClick=, onLoad= などのイベントハンドラ

// カスタムエラーメッセージ
export const INVALID_CHARS_MESSAGE = "不正な文字が含まれています";

// 文字列の検証関数
export const validateSafeString = (input: string, fieldName: string) => {
	if (invalidCharsPattern.test(input)) {
		return {
			success: false,
			error: { message: `${fieldName}に${INVALID_CHARS_MESSAGE}` },
		};
	}
	if (scriptTagPattern.test(input)) {
		return {
			success: false,
			error: { message: `${fieldName}に${INVALID_CHARS_MESSAGE}` },
		};
	}
	if (javascriptPattern.test(input)) {
		return {
			success: false,
			error: { message: `${fieldName}に${INVALID_CHARS_MESSAGE}` },
		};
	}
	if (onEventPattern.test(input)) {
		return {
			success: false,
			error: { message: `${fieldName}に${INVALID_CHARS_MESSAGE}` },
		};
	}
	return { success: true, data: input };
};
