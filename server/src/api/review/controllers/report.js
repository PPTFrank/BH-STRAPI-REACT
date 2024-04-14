module.exports = ({ strapi }) => ({
    async report(ctx) {
        const { start, end, product, category } = ctx.request.body;
        const res = await strapi.service('api::review.report').report({ start, end, product, category });
        return res
    },
}) 