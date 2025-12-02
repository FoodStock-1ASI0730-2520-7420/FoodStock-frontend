// src/iam/domain/model/user.entity.js
export class User {
    constructor({ name, email, password, phone, segment, profilePicture, plan }) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.segment = segment;
        this.profilePicture = profilePicture || null;
        this.plan = plan || null;
    }
}
