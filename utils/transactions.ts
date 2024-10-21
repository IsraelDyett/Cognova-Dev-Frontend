import * as bcrypt from "bcrypt";
async function hashPassword<T extends { password: string }>(data: T): Promise<T> {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, parseInt(`${process.env.SALT_ROUNDS}`, 10));
    }
    return data;
}
export { hashPassword };