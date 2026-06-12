import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

type MatchObject = Record<string, unknown>;

export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const constraints = args.constraints as string[];
          const relatedPropertyName = constraints[0];

          const targetObject = args.object as MatchObject;
          const relatedValue = targetObject[relatedPropertyName];

          return value === relatedValue;
        },
      },
    });
  };
}
