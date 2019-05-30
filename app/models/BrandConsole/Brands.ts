import { ICreateBrand, ITeam } from 'models/BrandConsole/types'

import Fetch from '../../services/fetch/index'

const defaultAssociations = ['brand.roles', 'brand_role.users']

export async function deprecatedGetBrands(brandId) {
  try {
    return await new Fetch().get(
      `/brands/${brandId}?associations[]=brand.roles&associations[]=brand_role.members`
    )
  } catch (error) {
    return { error }
  }
}

export async function getBrands(
  brandId: string,
  fetchChildren = true
): Promise<ApiResponse<ITeam>> {
  const associations = [...defaultAssociations]

  if (fetchChildren) {
    associations.push('brand.children')
  }

  return (await new Fetch().get(`/brands/${brandId}`).query({
    associations
  })).body
}

export async function getChildrenBrands(brandId) {
  try {
    return await new Fetch().get(
      `/brands/${brandId}/children?associations[]=brand.roles&associations[]=brand_role.users`
    )
  } catch (error) {
    return { error }
  }
}

export async function addBrand(
  brand: ICreateBrand,
  parentId: string
): Promise<ApiResponse<ITeam>> {
  const payload = { ...brand }

  if (parentId) {
    payload.parent = parentId
  }

  return (await new Fetch()
    .post('/brands')
    .query({ associations: defaultAssociations })
    .send(brand)).body
}

export async function editBrand(
  brand: Partial<ITeam>
): Promise<ApiResponse<ITeam>> {
  if (!brand.id) {
    throw new Error('team id is empty')
  }

  return (await new Fetch()
    .put(`/brands/${brand.id}`)
    .query({ associations: defaultAssociations })
    .send(brand)).body
}

export async function deleteBrand(brandId: string) {
  return new Fetch().delete(`/brands/${brandId}`)
}

export default {
  deprecatedGetBrands,
  getBrands,
  getChildrenBrands,
  addBrand,
  editBrand,
  deleteBrand
}
