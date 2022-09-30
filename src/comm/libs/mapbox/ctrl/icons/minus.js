const svg = `
<svg t="1654918696208" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22282" width="28" height="28"><path d="M467.549091 84.014545a383.534545 383.534545 0 0 1 290.257454 634.27491l173.98691 173.893818a28.020364 28.020364 0 1 1-39.563637 39.610182l-173.940363-173.98691a383.534545 383.534545 0 1 1-250.740364-673.838545z m124.183273 357.701819H341.736727a24.994909 24.994909 0 0 0-4.049454 49.664l4.049454 0.325818h249.949091a24.994909 24.994909 0 1 0 0-49.989818z" fill="#515151" p-id="22283"></path></svg>
`;
export default function () {
    return (new DOMParser().parseFromString(svg, 'image/svg+xml')).firstChild;
}
//# sourceMappingURL=minus.js.map