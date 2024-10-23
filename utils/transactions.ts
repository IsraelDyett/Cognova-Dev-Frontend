import * as bcrypt from "bcrypt";
async function hashPassword<T extends { password: string }>(data: T): Promise<T> {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, parseInt(`${process.env.SALT_ROUNDS}`, 10));
    }
    return data;
}

async function comparePassword(
    password: string,
    hash: string,
): Promise<{ matched: boolean; error: string | null }> {
    try {
        const matched = await bcrypt.compare(password, hash);
        return { matched, error: null };
    } catch (error: any) {
        return { matched: false, error: error.message };
    }
}
export { hashPassword, comparePassword };