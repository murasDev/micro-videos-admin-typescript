import { CategoriesController } from './categories.controller';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     imports: [ConfigModule.forRoot({}), CategoriesModule],
  //   })
  //     .overrideProvider(getModelToken(CategoryModel))
  //     .useValue({})
  //     .overrideProvider('CategoryRepository')
  //     .useValue(CategoryInMemoryRepository)
  //     .compile();

  //   controller = module.get<CategoriesController>(CategoriesController);
  //   console.log(module.get(ConfigService));
  // });

  it('should be defined', () => {
    console.log(controller);
    expect(controller).toBeDefined();
  });
});
