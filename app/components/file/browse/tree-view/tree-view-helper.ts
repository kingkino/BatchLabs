import { File } from "app/models";
import { FileState, TreeNodeData } from "app/models/tree-component";
import { prettyBytes } from "app/utils";
import { FilterBuilder } from "app/utils/filter-builder";

/**
 * Max treenodes number
 */
export const MAX_TREENODES_ITEMS: number = 100;

/**
 * Helper function that builds tree options with maxItems and filter
 * @param path
 */
export function buildTreeRootFilter(path: string) {
    let options = {
        pageSize: MAX_TREENODES_ITEMS,
    };
    if (path) {
        options["filter"] = FilterBuilder.prop("name").startswith(path).toOData();
    }
    return options;
}

/**
 * Helper function that prettify file size
 * @param size raw file size
 */
export function prettyFileSize(size: string): string {
    // having falsy issues with contentLength = 0
    return prettyBytes(parseInt(size || "0", 10));
}

/**
 * Helper function that helps to append pretty file size after file name
 * @param file
 */
export function getNameFromPath(file: File): string {
    let tokens = standardizeFilePath(file.name).split("\/");
    let displayName = tokens[tokens.length - 1];
    if (!file.isDirectory) {
        displayName = `${displayName} (${prettyFileSize(file.properties.contentLength.toString())})`;
    }
    return displayName;
}

/**
 * Replace all '\' with '/' in given path
 * @param filePath
 */
export function standardizeFilePath(filePath: string): string {
    return filePath.replace(/\\/g, "/");
}

/**
 * Helper function that map File to tree node
 */
export function mapFileToTree(file: File): TreeNodeData {
    return {
        name: getNameFromPath(file),
        fileName: standardizeFilePath(file.name),
        hasChildren: file.isDirectory,
        children: [] as TreeNodeData[],
        state: file.isDirectory ? FileState.COLLAPSED_DIRECTORY : FileState.FILE,
    } as TreeNodeData;
}
