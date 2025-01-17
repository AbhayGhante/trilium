import server from "../../../services/server.js";
import toastService from "../../../services/toast.js";

const TPL = `
<div>
    <h4>Tray</h4>

    <div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" id="tray-enabled">
        <label class="custom-control-label" for="tray-enabled">Enable tray (Trilium needs to be restarted for this change to take effect)</label>
    </div>
    <br/>
</div>

<div>
    <h4>Note erasure timeout</h4>

    <p>Deleted notes (and attributes, revisions...) are at first only marked as deleted and it is possible to recover them 
    from Recent Notes dialog. After a period of time, deleted notes are "erased" which means 
    their content is not recoverable anymore. This setting allows you to configure the length 
    of the period between deleting and erasing the note.</p>

    <div class="form-group">
        <label for="erase-entities-after-time-in-seconds">Erase notes after X seconds</label>
        <input class="form-control" id="erase-entities-after-time-in-seconds" type="number" min="0">
    </div>
    
    <p>You can also trigger erasing manually:</p>
    
    <button id="erase-deleted-notes-now-button" class="btn">Erase deleted notes now</button>
    
    <br/><br/>
</div>

<div>
    <h4>Note revisions snapshot interval</h4>

    <p>Note revision snapshot time interval is time in seconds after which a new note revision will be created for the note. See <a href="https://github.com/zadam/trilium/wiki/Note-revisions" class="external">wiki</a> for more info.</p>

    <div class="form-group">
        <label for="note-revision-snapshot-time-interval-in-seconds">Note revision snapshot time interval (in seconds)</label>
        <input class="form-control" id="note-revision-snapshot-time-interval-in-seconds" type="number" min="10">
    </div>
</div>

<div>
    <h4>Network connections</h4>
        
    <div class="form-group">
        <input id="check-for-updates" type="checkbox" name="check-for-updates">
        <label for="check-for-updates">Check for updates automatically</label>
    </div>
</div>`;

export default class OtherOptions {
    constructor() {
        $("#options-other").html(TPL);

        this.$trayEnabled = $("#tray-enabled");
        this.$trayEnabled.on('change', () => {
            const opts = { 'disableTray': !this.$trayEnabled.is(":checked") ? "true" : "false" };
            server.put('options', opts).then(() => toastService.showMessage("Options change have been saved."));

            return false;
        });
        
        this.$eraseEntitiesAfterTimeInSeconds = $("#erase-entities-after-time-in-seconds");

        this.$eraseEntitiesAfterTimeInSeconds.on('change', () => {
            const eraseEntitiesAfterTimeInSeconds = this.$eraseEntitiesAfterTimeInSeconds.val();

            server.put('options', { 'eraseEntitiesAfterTimeInSeconds': eraseEntitiesAfterTimeInSeconds }).then(() => {
                toastService.showMessage("Options change have been saved.");
            });

            return false;
        });

        this.$eraseDeletedNotesButton = $("#erase-deleted-notes-now-button");
        this.$eraseDeletedNotesButton.on('click', () => {
            server.post('notes/erase-deleted-notes-now').then(() => {
                toastService.showMessage("Deleted notes have been erased.");
            });
        });

        this.$noteRevisionsTimeInterval = $("#note-revision-snapshot-time-interval-in-seconds");

        this.$noteRevisionsTimeInterval.on('change', () => {
            const opts = { 'noteRevisionSnapshotTimeInterval': this.$noteRevisionsTimeInterval.val() };
            server.put('options', opts).then(() => toastService.showMessage("Options change have been saved."));

            return false;
        });

        this.$checkForUpdates = $("#check-for-updates");
        this.$checkForUpdates.on("change", () => {
            const isChecked = this.$checkForUpdates.prop("checked");
            const opts = { 'checkForUpdates': isChecked ? 'true' : 'false' };

            server.put('options', opts).then(() => toastService.showMessage("Options change have been saved."));
        });
    }

    optionsLoaded(options) {
        this.$trayEnabled.prop("checked", options['disableTray'] !== 'true');

        this.$eraseEntitiesAfterTimeInSeconds.val(options['eraseEntitiesAfterTimeInSeconds']);
        this.$noteRevisionsTimeInterval.val(options['noteRevisionSnapshotTimeInterval']);

        const checkForUpdates = options['checkForUpdates'] === 'true';
        this.$checkForUpdates.prop('checked', checkForUpdates);
    }
}
