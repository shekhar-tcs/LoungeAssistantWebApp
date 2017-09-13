var _ = require('lodash');
var builder = require('botbuilder');
var serviceCatalog = require('../../service/serviceCatalog.service');
var SimpleWaterfallDialog = require('./SimpleWaterfallDialog');
var ListPagination = require('./ListPagination');

var categoryOptions = {
    selectTemplate: 'select',
    pageSize: 10,
    unknownOption: 'unknown_option',
    showTitle: false
};

var productOptions = {
    selectTemplate: 'select',
    pageSize: 10,
    unknownOption: 'unknown_option',
    showTitle: true
};

var lib = new builder.Library('service-catalog');

// These steps are defined as a waterfall dialog,
// but the control is done manually by calling the next func argument.
lib.dialog('/',
    new SimpleWaterfallDialog([
        // First message
        function (session, args, next) {
            session.send('prompt_choices');
            next();
        },
        // Show Categories
        ListPagination.create(serviceCatalog.getCategories, serviceCatalog.getCategory, categoryMapping, categoryOptions),
        // Category selected
        function (session, args, next) {
            var category = args.selected;
            session.dialogData.category = category;
            if (category.name == "Guide me to my place") {
                session.endDialog(session.dialogData.category.response.message);
            } else {
                session.send(session.dialogData.category.response.message);
                session.message.text = null;            // remove message so next step does not take it as input
                next();
            }

        },
        // Show products
        function (session, args, next) {
            var category = session.dialogData.category;
            ListPagination.create(
                function (pageNumber, pageSize) { return serviceCatalog.getProducts(category.name, pageNumber, pageSize); },
                serviceCatalog.getProduct,
                productMapping,
                productOptions
            )(session, args, next);

        },
        // Product selected
        function (session, args, next) {
            // this is last step, calling next with args will end in session.endDialogWithResult(args)
            next({ selection: args.selected });
        }
    ]));

function categoryMapping(category) {
    return {
        title: category.name,
        //category:category,
        imageUrl: category.imageUrl,
        buttonLabel: category.title
    };
}

function productMapping(product) {
    return {
        title: product.name,
        imageUrl: product.image,
        buttonLabel: 'choose_this'
    };
}

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};