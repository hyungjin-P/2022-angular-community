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
}
