export const contourLayer = {
    id: '$contourLayerId',
    type: 'line',
    layout: {
        'line-cap': 'round',
        'line-join': 'round',
    },
    paint: {
        'line-dasharray': [0.2, 2],
        'line-color': '#3d5afe',
        'line-width': 2,
    },
};
export const shadowLayer = {
    id: '$shadowLayerId',
    type: 'fill',
    paint: { 'fill-opacity': 0 },
};
export const cornersLayer = {
    id: '$cornersLayer',
    type: 'circle',
    paint: {
        'circle-radius': 5,
        'circle-color': '#3d5afe',
        'circle-stroke-width': 3,
        'circle-stroke-color': '#fff',
    }
};
//# sourceMappingURL=layers.js.map