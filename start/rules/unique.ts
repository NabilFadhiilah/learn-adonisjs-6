import type { FieldContext } from "@vinejs/vine/types";
import db from "@adonisjs/lucid/services/db";
import vine from "@vinejs/vine";
import { VineString, VineNumber } from "@vinejs/vine";

type Options={
  table: string,
  column: string
}

async function isUnique(value: unknown, option: Options, field: FieldContext) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return
  }

  const result = await db
    .from(option.table)
    .select(option.column)
    .where(option.column,value)
    .first()

  if (result) {
    field.report('This {{field}} is already taken','isUnique',field)
  }
}

export const isUniqueRule = vine.createRule(isUnique)

declare module '@vinejs/vine'{
  interface VineString{
    isUnique(option:Options):this
  }
  interface VineNumber{
    isUnique(option:Options):this
  }
}

VineString.macro('isUnique',function(this: VineString, option:Options){
  return this.use(isUniqueRule(option))
})

VineNumber.macro('isUnique',function(this: VineNumber, option:Options){
  return this.use(isUniqueRule(option))
})
