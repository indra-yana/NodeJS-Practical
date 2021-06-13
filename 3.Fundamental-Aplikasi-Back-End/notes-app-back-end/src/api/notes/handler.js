
class NotesHandler {
    
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
    
        this.postNoteHandler = this.postNoteHandler.bind(this);
        this.getNotesHandler = this.getNotesHandler.bind(this);
        this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
        this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
        this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
    }

    postNoteHandler(request, h) {
        try {
            this._validator.validateNotePayload(request.payload);

            const { title = 'Untitled', body, tags } = request.payload;
            const noteId = this._service.addNote({ title, body, tags });

            return h.response({
                status: 'success',
                message: 'Catatan berhasil ditambahkan',
                data: {
                    noteId,
                },
            }).code(201);    
        } catch (error) {
            return h.response({
                status: 'fail',
                message: error.message,
            }).code(400);        
        }
        
    }

    getNotesHandler() {
        const notes = this._service.getNotes();

        return {
            status: 'success',
            data: {
                notes,
            }
        }
    }

    getNoteByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const note = this._service.getNoteById(id);

            return {
                status: 'success',
                data: {
                    note,
                }
            }
        } catch (error) {
            return h.response({
                status: 'fail', 
                message: error.message,
            }).code(404);
        }
        
    }

    putNoteByIdHandler(request, h) {
        try {
            this._validator.validateNotePayload(request.payload);

            const { id } = request.params;
            this._service.editNoteById(id, request.payload);

            return {
                status: 'success',
                message: 'Catatan berhasil diperbarui',
              };
        } catch (error) {
            return h.response({
                status: 'fail', 
                message: error.message,
            }).code(404);
        }
    }

    deleteNoteByIdHandler(request, h) {
        try {
            const { id } = request.params;

            this._service.deleteNoteById(id);
            
            return {
                status: 'success',
                message: 'Catatan berhasil dihapus',
            };
        } catch (error) {
            return h.response({
                status: 'fail', 
                message: 'Catatan gagal dihapus. Id tidak ditemukan',
            }).code(404);
        }

    }

}

module.exports = NotesHandler;