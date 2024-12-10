const blogDataValidation = ({ title, textBody }) => {
    return new Promise((resolve, reject) => {
        if (!title || !textBody) {
            reject("Missing Blog Data");
        }

        if (typeof title !== "string") {
            reject("Title is not a text");
        }

        if (typeof textBody !== "string") {
            reject("TextBody is not a text");
        }

        if (title.length < 3 || title.length > 100) {
            reject("Title length must be 3-100 characters");
        }

        if (textBody.lenght > 1000) {
            reject("TextBody lenght must be under 1000 characters");
        }

        resolve();
    })
}

module.exports = blogDataValidation;