export class MiniCartError extends Error {
  public props: unknown;
  constructor(message: string, props: unknown) {
    super(message);
    this.props = props;
  }
}
