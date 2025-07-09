<template>
    <div class="flex align-items-center flex-column">
        <h3 class="text-bold" :style="{ color }">{{label}}</h3>
        <div class="test-result" v-if="testing && testResult.input">
            {{formattedInput}}
        </div>
    </div>
</template>

<script>

import EventBus from "@/utils/EventBus";
import WidgetTemplate from "../../template.vue"

export default {
    name: "InputTemplate",
    extends: WidgetTemplate,
    computed: {
        formattedInput () {
            try {
                return JSON.stringify(this.testResult.input, null, 2)
            }
            catch(err) {
                return this.testResult.input
            }
        }
    },
    data() {
        return {

        }
    }
}
</script>
