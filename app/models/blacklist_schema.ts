export {}
import mongoose, { Schema, Document} from 'mongoose';

export interface BlacklistInterface extends Document {
    address: string,
}
const BlacklistSchema: Schema = new Schema({
    address: {
        type: String, 
        required: true
    }
});

const Blacklist = mongoose.model<BlacklistInterface>('Blacklist', BlacklistSchema);
export default Blacklist;
