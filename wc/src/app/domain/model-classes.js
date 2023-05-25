define(["lib/domain", "app/domain/metadata-ext"], function (domain, metadata) {
    "use strict";

    var model = domain.buildModel(metadata);

    return model;
});