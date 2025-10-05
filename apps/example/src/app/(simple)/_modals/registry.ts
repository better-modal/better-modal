import { Simple } from "@/app/(simple)/_modals/simple";
import { modal, registry } from "./init";

export const modals = registry({
    simple: modal(Simple, "dialog").withDefaults({
        variant: {
            title: "Simple Title",
            description: "Simple Description",
        }
    })
})

