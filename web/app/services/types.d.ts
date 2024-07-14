interface IModel {
  label: string;
  provider: string;
  value: string;
}

interface IModelProvider {
  id: number;
  label: string;
  provider: string;
  value: string;
  level: number;
  created_at: Date;
  updated_at: Date;
}
