"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_handlebars_1 = require("express-handlebars");
const handlebars = (0, express_handlebars_1.create)({
    defaultLayout: 'public',
    extname: "hbs",
    helpers: {
        currency: (amount, fraction = 0) => {
            return Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: fraction }).format(amount);
        },
        sum: (amount1, amount2) => {
            return amount1 + amount2;
        }
    }
});
exports.default = handlebars;
