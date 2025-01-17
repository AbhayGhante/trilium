import server from "../../../services/server.js";
import toastService from "../../../services/toast.js";

const TPL = `
<p><strong>Settings on this options tab are saved automatically after each change.</strong></p>

<form>
    <h4>Heading style</h4>
    <select class="form-control" id="heading-style">
        <option value="plain">Plain</option>
        <option value="underline">Underline</option>
        <option value="markdown">Markdown-style</option>
    </select>
    
    <br/>
    
    <h4>Table of contents</h4>
    
    Table of contents will appear in text notes when the note has more than a defined number of headings. You can customize this number:
    
    <div class="form-group">
        <input type="number" class="form-control" id="min-toc-headings" min="0" max="9999999999999999" step="1" style="text-align: right;"/>
    </div>
    
    <p>You can also use this option to effectively disable TOC by setting a very high number.</p>
    
    <div>
    <h4>Automatic readonly size</h4>

    <p>Automatic readonly note size is the size after which notes will be displayed in a readonly mode (for performance reasons).</p>

    <div class="form-group">
        <label for="auto-readonly-size-text">Automatic readonly size (text notes)</label>
        <input class="form-control" id="auto-readonly-size-text" type="number" min="0" style="text-align: right;">
    </div>
</div>
</form>`;

export default class TextNotesOptions {
    constructor() {
        $("#options-text-notes").html(TPL);

        this.$body = $("body");

        this.$headingStyle = $("#heading-style");
        this.$headingStyle.on('change', () => {
            const newHeadingStyle = this.$headingStyle.val();

            this.toggleBodyClass("heading-style-", newHeadingStyle);

            server.put('options/headingStyle/' + newHeadingStyle);
        });

        this.$minTocHeadings = $("#min-toc-headings");
        this.$minTocHeadings.on('change', () => {
            const minTocHeadings = this.$minTocHeadings.val();

            server.put('options/minTocHeadings/' + minTocHeadings);
        });

        this.$autoReadonlySizeText = $("#auto-readonly-size-text");

        this.$autoReadonlySizeText.on('change', () => {
            const opts = { 'autoReadonlySizeText': this.$autoReadonlySizeText.val() };
            server.put('options', opts).then(() => toastService.showMessage("Options change have been saved."));

            return false;
        });
    }

    toggleBodyClass(prefix, value) {
        for (const clazz of Array.from(this.$body[0].classList)) { // create copy to safely iterate over while removing classes
            if (clazz.startsWith(prefix)) {
                this.$body.removeClass(clazz);
            }
        }

        this.$body.addClass(prefix + value);
    }

    async optionsLoaded(options) {
        this.$headingStyle.val(options.headingStyle);
        this.$minTocHeadings.val(options.minTocHeadings);
        this.$autoReadonlySizeText.val(options.autoReadonlySizeText);
    }
}
