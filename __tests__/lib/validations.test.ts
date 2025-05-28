import { INVALID_CHARS_MESSAGE, validateSafeString } from "@/lib/validations";

describe("validations", () => {
    test("不正な文字列が入った時、falseとエラーメッセージが変える", () => {
        // Arrange
        const input = "[test]{}<script>alert('XSS')</script>";
        const fieldName = "test";

        // Act
        const result = validateSafeString(input, fieldName);

        // Assert
        expect(result.success).toBe(false);
        expect(result.error?.message).toBe(`${fieldName}に${INVALID_CHARS_MESSAGE}`)
    });
    test("scriptが入った時、falseとエラーメッセージが変える", () => {
        // Arrange
        const input = "test<script>alert('XSS')</script>";
        const fieldName = "test";
        
        // Act
        const result = validateSafeString(input, fieldName);

        // Assert
        expect(result.success).toBe(false);
        expect(result.error?.message).toBe(`${fieldName}に${INVALID_CHARS_MESSAGE}`)
    });
    test("onEventが入った時、falseとエラーメッセージが変える", () => {
        // Arrange
        const input = "onClick='alert('XSS'')'";
        const fieldName = "test";

        // Act
        const result = validateSafeString(input, fieldName);

        // Assert
        expect(result.success).toBe(false);
        expect(result.error?.message).toBe(`${fieldName}に${INVALID_CHARS_MESSAGE}`)
        
    });
    test("正常な文字列が入った時、trueとdataが変える", () => {
        // Arrange
        const input = "test";
        const fieldName = "test";

        // Act
        const result = validateSafeString(input, fieldName);

        // Assert
        expect(result.success).toBe(true);
        expect(result.data).toBe(input);
    })
});
