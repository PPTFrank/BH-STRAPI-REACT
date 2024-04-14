const moment = require('moment');
const _ = require('lodash')
const excel = require('exceljs');

module.exports = ({ strapi }) => ({
    async report({ start, end, product, category }) {
        try {
            if (!start || start == '' || start === 'null' || start === 'undefined') {
                throw ({ data: null, code: -1, message: 'Start is required' });
            };
            if (moment(start, 'YYYY-MM-DD', true).isValid() === false) {
                throw ({ data: null, code: -2, message: 'start format is not YYYY-MM-DD' });
            }
            if (!end || end == '' || end === 'null' || end === 'undefined') {
                throw ({ data: null, code: -3, message: 'End is required' });
            };
            if (moment(end, 'YYYY-MM-DD', true).isValid() === false) {
                throw ({ data: null, code: -4, message: 'end format is not YYYY-MM-DD' });
            }
            let find = {
                created_at: {
                    $gte: moment(start).format('YYYY-MM-DD 00:00:00'),
                    $lt: moment(end).add(1, 'days').format('YYYY-MM-DD 00:00:00')
                }
            }
            if (category) {
                const findCategory = await strapi.db.query("api::category.category").findOne({
                    where: { id: category },
                    populate: {
                        products: true
                    }
                });
                if (!findCategory) {
                    throw ({ data: null, code: -5, message: 'Not found category' });
                };
                const products = _.get(findCategory, "products", []);
                const mapProducts = products.map(dt => {
                    return _.get(dt, 'id').toString();
                });
                find = {
                    productId: mapProducts,
                    ...find
                }
            };
            const findReview = await strapi.db.query("api::review.review").findMany({
                where: find
            });
            let finalArray = [];
            for (item of findReview) {
                const productId = parseInt(_.get(item, 'productId'));
                const findProduct = await strapi.db.query("api::product.product").findOne({
                    where: {
                        id: productId
                    }
                });
                if (findProduct) {
                    finalArray.push({
                        email: _.get(item, 'email'),
                        userName: _.get(item, 'username'),
                        text: _.get(item, 'text'),
                        start: _.get(item, 'stars'),
                        nameProduct: findProduct.name,
                        createdAt: _.get(item, 'createdAt'),
                    });
                };
            }
            const headersExcel = [
                {
                    colA: 'Ngày',
                    colB: 'Giờ',
                    colC: 'Tên người dùng',
                    colD: 'Mail người dùng',
                    colE: 'Tên sản phẩm',
                    colF: 'Số sao',
                    colG: 'Đánh giá',
                }
            ]
            const workbook = new excel.Workbook();
            const worksheet = workbook.addWorksheet(`Đánh giá ản phẩm ${moment(start, 'YYYY-MM-DD').format('DD-MM-YYYY')} đến ${moment(end, 'YYYY-MM-DD').format('DD-MM-YYYY')} `);
            const color = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '66ccff' },
            };
            worksheet.views = [
                {
                    showGridLines: false
                }
            ];
            const fontHeader = { name: 'Times New Roman', bold: true, size: 11 };
            const fontTable = { name: 'Times New Roman', bold: false, size: 11 };
            headersExcel.forEach((item, index) => {
                worksheet.getCell(`A${index + 1}`).fill = color;
                worksheet.getCell(`A${index + 1}`).font = { ...fontHeader, color: { argb: '000000' } };
                worksheet.getCell(`A${index + 1}`).value = item.colA;
                worksheet.getCell(`B${index + 1}`).fill = color;
                worksheet.getCell(`B${index + 1}`).font = { ...fontHeader, color: { argb: '000000' } };
                worksheet.getCell(`B${index + 1}`).value = item.colB;
                worksheet.getCell(`C${index + 1}`).fill = color;
                worksheet.getCell(`C${index + 1}`).font = { ...fontHeader, color: { argb: '000000' } };
                worksheet.getCell(`C${index + 1}`).value = item.colC;
                worksheet.getCell(`D${index + 1}`).fill = color;
                worksheet.getCell(`D${index + 1}`).font = { ...fontHeader, color: { argb: '000000' } };
                worksheet.getCell(`D${index + 1}`).value = item.colD;
                worksheet.getCell(`E${index + 1}`).fill = color;
                worksheet.getCell(`E${index + 1}`).font = { ...fontHeader, color: { argb: '000000' } };
                worksheet.getCell(`E${index + 1}`).value = item.colE;
                worksheet.getCell(`F${index + 1}`).fill = color;
                worksheet.getCell(`F${index + 1}`).font = { ...fontHeader, color: { argb: '000000' } };
                worksheet.getCell(`F${index + 1}`).value = item.colF;
                worksheet.getCell(`G${index + 1}`).fill = color;
                worksheet.getCell(`G${index + 1}`).font = { ...fontHeader, color: { argb: '000000' } };
                worksheet.getCell(`G${index + 1}`).value = item.colG;
            });
            finalArray.forEach((item, index) => {
                worksheet.getCell(`A${index + 2}`).value = moment(item.createdAt).format('DD-MM-YYYY');
                worksheet.getCell(`A${index + 2}`).font = fontTable;
                worksheet.getCell(`B${index + 2}`).value = moment(item.createdAt).format('HH:mm:ss');
                worksheet.getCell(`B${index + 2}`).font = fontTable;
                worksheet.getCell(`C${index + 2}`).value = item.userName;
                worksheet.getCell(`C${index + 2}`).font = fontTable;
                worksheet.getCell(`D${index + 2}`).value = item.email;
                worksheet.getCell(`D${index + 2}`).font = fontTable;
                worksheet.getCell(`E${index + 2}`).value = item.nameProduct;
                worksheet.getCell(`E${index + 2}`).font = fontTable;
                worksheet.getCell(`F${index + 2}`).value = item.start;
                worksheet.getCell(`F${index + 2}`).font = fontTable;
                worksheet.getCell(`G${index + 2}`).value = item.text;
                worksheet.getCell(`G${index + 2}`).font = fontTable;
            });
            const lastTableRow = worksheet.lastRow.number
            worksheet.columns.forEach(function (column) {
                let maxLength = 0;
                column["eachCell"]({ includeEmpty: true }, function (cell) {
                    var columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength + 4;
                    }
                });
                column.width = maxLength < 10 ? 10 : maxLength;
                column.alignment = { vertical: 'middle', horizontal: 'left' };
            });
            worksheet.eachRow(function (i, rowNumber) {
                if (rowNumber >= 2 && rowNumber % 2) {
                    var i = rowNumber;
                    const rows = worksheet.getRow(i);
                    rows.eachCell(function (cell) {
                        if (cell.value)
                            cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: {
                                    argb: 'ebebe0'
                                }
                            };
                    });
                }
            });
            for (let row = 1; row <= 1; row++) {
                for (let col = 1; col <= 7; col++) {
                    const cell = worksheet.getCell(`${String.fromCharCode(64 + col)}${row}`);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                }
            }
            for (let row = 2; row <= lastTableRow; row++) {
                for (let col = 1; col <= 7; col++) {
                    const cell = worksheet.getCell(`${String.fromCharCode(64 + col)}${row}`);
                    cell.border = {
                        top: { style: 'dashed' },
                        left: { style: 'thin' },
                        bottom: { style: 'dashed' },
                        right: { style: 'thin' },
                    };
                }
            }
            for (let row = lastTableRow; row <= lastTableRow; row++) {
                for (let col = 1; col <= 7; col++) {
                    const cell = worksheet.getCell(`${String.fromCharCode(64 + col)}${row}`);
                    cell.border = {
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
            }
            const buffer = await workbook.xlsx.writeBuffer();
            return buffer;
        } catch (error) {
            if (_.get(error, 'code', '') === "") {
                strapi.log['error'](`Warehouse export error: ${error.message}`);
                error = {
                    data: null,
                    code: -999,
                    message: 'Unknow error'
                }
            }
            else {
                strapi.log['error'](`Warehouse export error: ${error.message}`);
            }
            return {
                ...error
            }
        };
    },
});