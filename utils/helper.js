import { supportedMimesType } from "../config/fileSystem.js";
import { v4 as uuidv4 } from "uuid";

export const imageValidator = async (size, mime) => {
    try {
        if (bytesToMB(size) > 2) {
            return "Image size must be less than 2 MB";
        }
        else if (!supportedMimesType.includes(mime)) {
            return "Image size must be png, jpeg, jpg, svg, gif, webp..";
        }

        return null;
    } catch (error) {
        console.log(`Error while uploading image: imageValidator `);
    }
}

export const bytesToMB = (bytes) => {
    return bytes / (1024 * 1024);
}

export const generateRandomNum = () =>  {
    return uuidv4();
}

export const responseTransformer = (news, protocol, host) => {
    return {
        id: news.id,
        title: news.title,
        content: news.content,
        image: `${protocol}://${host}/images/${news.image}`,
        created_at: news.created_at,
        updated_at: news.updated_at,
        reporter: news.user
    }
}