<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class UploadAttachamentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        if(Request::route() && in_array(Request::route()->parameter('type'), ['payment-request', 'verify-asset'])) {
            return [
                'file' => 'required|mimes:'.'jpg,jpeg,png,pdf,xls,xlsx, mp4'.'|max:'.(string) ((int) getSetting('media.max_file_upload_size') * 1024),
            ];
        } else {
            return [
                'file' => 'required|mimes:'.getSetting('media.allowed_file_extensions').'|max:'.(string) ((int) getSetting('media.max_file_upload_size') * 1024),
            ];
        }
    }
}
