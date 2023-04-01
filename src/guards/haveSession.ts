import backend from "../data/BackendFactory";

export const HaveSession = async () => {
    const session = await backend.instance.session.checkSession({
        create: ["all"],
        read: ["all"],
        update: ["all"],
        delete: ["all"],
    });

    return session.status == "OK";
};
