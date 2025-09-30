const modelViewerComparison1 = document.querySelector("model-viewer#modelViewerComparison1");
const modelViewerComparison2 = document.querySelector("model-viewer#modelViewerComparison2");

// Initialize the selection panel images
$('#comparisonSelectionPanel .selectable-image').each((i, img) => {
    img.src = `static/comparison/${img.getAttribute('name')}/color_no_bg.png`;
})

// Click an image to select the case
const comparisonSelectionPanel = document.getElementById('comparisonSelectionPanel');
comparisonSelectionPanel.addEventListener('click', function (event) {
    const img = event.target.closest('.selectable-image');
    if (!img || img.classList.contains('selected'))
        return;

    // Highlight the selected image
    comparisonSelectionPanel.querySelectorAll('.selectable-image').forEach(function (image) {
        image.classList.remove('selected');
    });
    img.classList.add('selected');

    // Load the corresponding model
    const name = img.getAttribute('name');

    const meshPath1 = `static/comparison/${name}/grasp_ours.glb`, meshPath2 = `static/comparison/${name}/grasp_anygrasp.glb`;

    modelViewerComparison1.src = meshPath1;
    modelViewerComparison1.resetView();
    modelViewerComparison1.showPoster();

    modelViewerComparison2.src = meshPath2;
    modelViewerComparison2.resetView();
    modelViewerComparison2.showPoster();
});

// Sync the view of two model viewers
var syncViewWith = undefined;
var syncViewEnabled = true;

const syncView = (event) => {
    if (!syncViewEnabled || event.target !== syncViewWith)
        return;
    const source = syncViewWith;
    const target = source === modelViewerComparison1 ? modelViewerComparison2 : modelViewerComparison1;

    const sourceOrbit = source.getCameraOrbit();
    const sourceTarget = source.getCameraTarget();
    const sourceFoV = source.getFieldOfView();
    target.cameraOrbit = `${sourceOrbit.theta}rad ${sourceOrbit.phi}rad ${sourceOrbit.radius}m`;
    target.cameraTarget = `${sourceTarget.x}m ${sourceTarget.y}m ${sourceTarget.z}m`;
    target.fieldOfView = `${sourceFoV}deg`;
    target.jumpCameraToGoal();
}

modelViewerComparison1.addEventListener('camera-change', syncView)
modelViewerComparison1.addEventListener('mousedown', () => { syncViewWith = modelViewerComparison1; });
modelViewerComparison1.addEventListener('wheel', () => { syncViewWith = modelViewerComparison1; });
modelViewerComparison1.resetView = function () {
    modelViewerComparison1.cameraTarget = '0m 0m 0m';
    modelViewerComparison1.fieldOfView = '45deg';
    modelViewerComparison1.cameraOrbit = '0deg 90deg 1m';
    modelViewerComparison1.resetTurntableRotation(0);
    modelViewerComparison1.jumpCameraToGoal();
}

modelViewerComparison2.addEventListener('camera-change', syncView)
modelViewerComparison2.addEventListener('mousedown', () => { syncViewWith = modelViewerComparison2; });
modelViewerComparison2.addEventListener('wheel', () => { syncViewWith = modelViewerComparison2; });
modelViewerComparison2.resetView = function () {
    modelViewerComparison2.cameraTarget = '0m 0m 0m';
    modelViewerComparison2.fieldOfView = '45deg';
    modelViewerComparison2.cameraOrbit = '0deg 90deg 1m';
    modelViewerComparison2.resetTurntableRotation(0);
    modelViewerComparison2.jumpCameraToGoal();
}

// Initialize the model viewer with selected model
$(document).ready(() => {
    const name = document.querySelector('#comparisonSelectionPanel .selectable-image.selected').getAttribute('name');

    const meshPath1 = `static/comparison/${name}/grasp_ours.glb`, meshPath2 = `static/comparison/${name}/grasp_anygrasp.glb`;

    modelViewerComparison1.src = meshPath1;
    modelViewerComparison1.isTextured = true;
    modelViewerComparison1.resetView();
    modelViewerComparison1.showPoster();

    modelViewerComparison2.src = meshPath2;
    modelViewerComparison2.isTextured = true;
    modelViewerComparison2.resetView();
    modelViewerComparison2.showPoster();
});
