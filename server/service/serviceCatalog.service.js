var _ = require('lodash');
var Promise = require('bluebird');
var allCategories = require('../data/service-categories.json');


// var catalogService = {
//     // Categories
//     getCategories: function (pageNumber, pageSize) {
//         return pageItems(pageNumber, pageSize, allCategories);
//     },
//
//     // Get Single Category
//     getCategory: function (categoryName) {
//         var category = _.find(allCategories, ['name', categoryName]);
//         return Promise.resolve(category);
//     },
//
//     // Products
//     getProducts: function (categoryName, pageNumber, pageSize) {
//         var category = this.getCategory(categoryName);
//         var allProducts = category.response.options;
//         return pageItems(pageNumber, pageSize, allProducts);
//     },
//
//     // Get Single Product
//     getProduct: function (productName) {
//         var product = _.find(allProducts, ['name', productName]);
//         return Promise.resolve(product);
//     }
// };

// helpers
function pageItems(pageNumber, pageSize, items) {
    var pageItems = _.take(_.drop(items, pageSize * (pageNumber - 1)), pageSize);
    var totalCount = items.length;
    return Promise.resolve({
        items: pageItems,
        totalCount: totalCount
    });
}

exports.getCategories = function (pageNumber, pageSize) {
    return pageItems(pageNumber, pageSize, allCategories);
}

exports.getCategory = function (categoryName) {
    var category = _.find(allCategories, ['name', categoryName]);
    return Promise.resolve(category);
}

exports.getProducts = function (categoryName, pageNumber, pageSize) {
    var category = _.find(allCategories, ['name', categoryName]);
    var allProducts = category.response.options;
    return pageItems(pageNumber, pageSize, allProducts);
}

exports.getProduct = function (productName) {
    var product = _.find(allProducts, ['name', productName]);
    return Promise.resolve(product);
}


// export
//module.exports = catalogService;