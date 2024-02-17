import vine from "@vinejs/vine";
import { CustomErrorReporter } from "./CustomerErrorReporter.js";

vine.errorReporter = () => new CustomErrorReporter();

export const newsSchema = vine.object({
    title: vine.string().minLength(5).maxLength(90),
    content: vine.string().minLength(10).maxLength(30000)
});