import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class HelperService {
    ImproveImageQuality(element: HTMLImageElement) {
        let splitedSrc = element.src.split('?')
        const qs = new URLSearchParams(splitedSrc[1])
        let q = qs.get('q')

        if (q != null && q != '100') {
            qs.set('q', '100')
            element.src = splitedSrc[0] + '?' + qs.toString()
        }
    }

    dataURLtoFile(dataUrl, fileName) {
        var arr = dataUrl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n)

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }

        return new File([u8arr], fileName, { type: mime })
    }
}
