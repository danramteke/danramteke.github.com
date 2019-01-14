# Export Business Card 

## Sketch.app
1. Create an artboard using the equivalent paper print resolution (300ppi) in pixels. For example, A3 portrait = 3508px X 4962px.
2. Add artwork.
3. Export as PNG at 1x size.
4. I now have a PNG of what I want to print but the file doesn’t know it’s intended for print, as Sketch exports at 72ppi.

## Preview.app
1. Open your PNG in Preview.
2. Tools > Adjust Size.
3. Uncheck ‘Resample image’.
4. Change resolution to 300.
5. The width and height in cms will change automatically to the physical target size, which you can verify matches your desired print. For example, A3 portrait = 29.7cm X 42cm (pixel dimensions do not change.).
6. OK.
7. File > Export as PDF.
8. Show Details.
9. Change ‘Paper Size’ to your desired print. For example, A3.
10. Save.

You now have a PDF ready for print.

From https://medium.com/@charlesrt/using-sketch-and-preview-to-print-61798a40e3ab
