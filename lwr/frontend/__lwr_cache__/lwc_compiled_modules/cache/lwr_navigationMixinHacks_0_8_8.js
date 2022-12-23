// This is claimed to be a portable module, but it really isn't. It can be imported, but will not RUN in the portable environment
import { guid } from 'lwr/routerUtils'; // A hack to get NavigationMixin working without requiring lwc

export const CONTEXT_ID_BACKDOOR = `universalcontainergetnavigationcontext${guid()}`;