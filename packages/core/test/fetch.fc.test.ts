import fc from 'fast-check'
import { buildPlacementsRequest } from '../src/fetch'
import { IABContentTaxonomyTypes } from '@core/types'
import { AdPlacement } from '@heyapi'

describe('buildPlacementsRequest', () => {
  test('should return an array where each placement is unique', () => {
    const placement1 = fc.string()
    const placement2 = fc.string()
    const placement3 = fc.string()
    const config1 = fc.record({
      placementId: placement1,
    })
    const config2 = fc.record({
      placementId: placement2,
      fixedSize: fc.record({
        width: fc.integer(),
        height: fc.integer(),
      }),
    })
    const config3 = fc.record({
      placementId: placement3,
      fixedSize: fc.record({
        width: fc.integer(),
        height: fc.integer(),
      }),
      iabContent: fc.record({
        taxonomy: fc.constantFrom(...IABContentTaxonomyTypes),
        categoryIds: fc.array(fc.string()),
      }),
    })
    const mozAdsPlacements = fc.record({
      placement1: config1,
      placement2: config2,
      placement3: config3,
    })

    fc.assert(
      fc.property(mozAdsPlacements, (data) => {
        const placementRequest = buildPlacementsRequest(data)
        return hasUniquePlacements(placementRequest)
      }),
    )
  })

  // it('should fail gracefully', () => {
  //   fc.assert(
  //     fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => {
  //       const text = a + b + c
  //       const pattern = b
  //       const index = indexOf(text, pattern)
  //       return index === -1 || text.substr(index, pattern.length) === pattern
  //     }),
  //   )
  // })
})

const hasUniquePlacements = (adPlacements: AdPlacement[]) => {
  const uniques = new Set(adPlacements.map(item => item['placement']))
  console.log('Uniques: ')
  console.log(uniques)
  return [...uniques].length === adPlacements.length
}
