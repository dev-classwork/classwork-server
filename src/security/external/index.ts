import User from './UserObject';
import Class from './ClassObject';
import Git from './GitObject';
import Team from './TeamObject';

class ExternalSecurity {
    user = new User();
    class = new Class();
    git = new Git();
    team = new Team();
}

export default ExternalSecurity;