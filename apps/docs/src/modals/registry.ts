import { Example } from "@/modals/example";
import { modal, registry } from "./init";

export const modals = registry({
    test: modal(Example, "shadcn-dialog"),
});



