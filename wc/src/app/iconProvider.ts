import * as core from "core";
import AppIconProvider = require("dms/modules/icons/AppIconProvider");

core.ui.iconProvider = new AppIconProvider();

export = core.ui.iconProvider;