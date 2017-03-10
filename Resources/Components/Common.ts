import { default as CustomJSComponent, CustomJSComponentInspectorFields } from "Modules/CustomJSComponent";
"atomic component";

export interface CommonInspectorFields extends CustomJSComponentInspectorFields {
    name?: string;
}

export default class Common extends CustomJSComponent {
    /**
    * Fields witihin the inspectorFields object will be exposed to the editor
    */
    inspectorFields: CommonInspectorFields = {
        debug: false,
        name: "entity"
    };

    name = "unknown";
}