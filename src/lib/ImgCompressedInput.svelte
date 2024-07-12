<script>
    import Compressor from "compressorjs";

    export let name = "image";
    export let className = "upload-file";
    export let onCompressed = (imageObj) => {};
    export let fileInput;

    const onFileSelected = (e) => {
        let imageObj = e.target.files[0];
        new Compressor(imageObj, {
            quality: 0.6,
            maxHeight: 1000,
            maxWidth: 1000,

            // The compression process is asynchronous,
            // which means you have to access the `result` in the `success` hook function.
            success(result) {
                let file = new File([result], "filename.jpg");
                let container = new DataTransfer();
                container.items.add(file);
                fileInput.files = container.files;
                onCompressed(imageObj);
            },
            error(err) {
                console.error(err.message);
            },
        });
    }
</script>

<input class="{className}" type="file" name="{name}"  accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileInput} />

<style>
    .upload-file {
        display: none;
    }
</style>