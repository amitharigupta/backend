import vine,  { errors } from "@vinejs/vine";
import { newsSchema } from "../validations/NewsValidation.js"
import { generateRandomNum, imageValidator } from "../utils/helper.js";
import prisma from "../database/db.config.js";
import path from "path";
import { responseTransformer } from "../utils/helper.js";

class NewsController {
    static async getAllNews(req, res) {
        try {
            const news = await prisma.news.findMany({
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profile: true
                        }
                    }
                }
            });
            const host = req.get('host');
            const protocol = req.protocol;
            const transformedResponse = news.map((item) => responseTransformer(item, protocol, host));

            if(transformedResponse.length > 0) {
                return res.status(200).json({ status: 200, message: "News fetched successfully", data: transformedResponse });
            } else {
                return res.status(404).json({ status: 200, message: "No news found" });
            }
        } catch (error) {
            console.log(`Error while getting getAllNews ${error}`);
            return res.status(500).json({ status: 500, message: "Internal Server Error" });
        }
    }

    static async store(req, res) {
        try {
            const user = req.user;
            const body = req.body;
            const validator = vine.compile(newsSchema);

            const payload = await validator.validate(body);

            if(!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ status: false, message: "Validation Error Please provide Proper Details", errors: "Image field is required." });
            }

            const image = req.files?.image;

            const message = await imageValidator(image?.size, image?.mimetype);

            if(message !== null) {
                return res.status(400).json({ status: 400, errors: { image: message  } });
            }

            const imgExt = path.extname(image.name);
            const imageName = await generateRandomNum() + imgExt;

            const uploadPath = process.cwd() + "/public/images/" + imageName;

            image.mv(uploadPath, (err) => {
                if(err) throw err;
            });

            payload.image = imageName;
            payload.user_id = user.id;

            console.log('payload', payload);
            const news = await prisma.news.create({ data: payload });

            return res.status(200).json({ status: 200, message: "News created successfully", data: news });

        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                console.log(error.messages);
                return res.status(400).json({ status: false, message: "Validation Error Please provide Proper Details", errors: error.messages });
            } else {
                return res.status(500).json({ status: 500, message: `Something went wrong. Please try again.` });
            }
        }
    }

    static async show(req, res) {

    }

    static async update(req, res) {

    }

    static async destroy(req, res) {

    }
}

export default NewsController;