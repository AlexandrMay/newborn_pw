import * as mongoose from 'mongoose';

export class DbHelper {
    private static async connect() {
        await mongoose.connect('mongodb://testUser:qwerty12345@5.189.186.217:27017/admin?authMechanism=DEFAULT').then(() => {
            console.log('Mongo is connected')
        }).catch(error => console.log(error));
    }

    static async getCategories() {
        await this.connect();
        const categorySchema = new mongoose.Schema({
            // name: {
            //     type: String,
            //     required: true
            //   },
            //   imageSrc: {
            //     type: String,
            //     default: ''
            //   },
              user: {
                ref: 'users',
                type: mongoose.Schema.Types.ObjectId
              },
            //   _id: {
            //     type: String
            //   },
            //   __v: {
            //     type: Number
            //   }

        });
        const categoryModel = mongoose.model('categories', categorySchema);
        const result = await categoryModel.find({
            user: '65227e57146a28199b53060f'
        });
        await mongoose.disconnect();
        return result;
    }
}