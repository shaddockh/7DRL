import { default as CustomJSComponent, CustomJSComponentInspectorFields } from "Modules/CustomJSComponent";

"atomic component";

export interface AttackInspectorFields extends CustomJSComponentInspectorFields {
    attackValue?: number;
}

export default class Attack extends CustomJSComponent {
    /**
    * Fields witihin the inspectorFields object will be exposed to the editor
    */
    inspectorFields: AttackInspectorFields = {
        debug: true,
        attackValue: 1
    };

    attackValue = 1;
}