export {}
import mongoose, { Schema, Document} from 'mongoose';

export interface BlacklistInterface extends Document {
    address: string,
    author: string
}
const BlacklistSchema: Schema = new Schema({
    address: {
        type: String, 
        required: true
    },
    reason: {
        type: String,
        required: true
    }
})

const Blacklist = mongoose.model<BlacklistInterface>('Blacklist', BlacklistSchema);

module.exports = Blacklist;
